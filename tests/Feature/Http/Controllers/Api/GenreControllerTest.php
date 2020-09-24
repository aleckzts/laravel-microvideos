<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use App\Http\Controllers\Api\GenreController;
use Illuminate\Http\Request;
use Tests\Exception\TestException;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;
    /**
     * A basic feature test example.
     *
     * @return void
     */

    private $genre;

    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create([
            'is_active' => false
        ]);
    }

    public function testIndex()
    {
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJSON([$this->genre->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));

        $response
            ->assertStatus(200)
            ->assertJSON($this->genre->toArray());
    }

    public function testInvalidationData()
    {
        $data = [
            'name' => '',
            'categories_id' => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = [
            'name' => str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = [
            'is_active' => 'a'
        ];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');

        $data = [
            'categories_id' => 'a',
        ];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'categories_id' => [100],
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $deleted_category = factory(Category::class)->create();
        $deleted_category->delete();
        $data = [
            'categories_id' => [$deleted_category->id],
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

    }

    public function testStore()
    {
        $category = factory(Category::class)->create();
        $data = [
            'name' => 'test'
        ];
        $response = $this->assertStore($data + ['categories_id' => [$category->id]],
                                       $data + ['is_active' => true, 'deleted_at' => null]);
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);

        $this->assertHasCategory($response->json('id'), $category->id);

        $data = [
            'name' => 'test',
            'is_active' => false,
        ];
        $this->assertStore($data + ['categories_id' => [$category->id]],
                           $data + ['is_active' => false]);
    }

    public function testUpdate()
    {
        $category = factory(Category::class)->create();
        $data = [
            'name' => 'test',
            'is_active' => true
        ];
        $response = $this->assertUpdate($data + ['categories_id' => [$category->id]],
                                        $data + ['deleted_at' => null]);
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);

        $this->assertHasCategory($response->json('id'), $category->id);
    }

    protected function assertHasCategory($genreId, $categoryId)
    {
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $genreId,
            'category_id' => $categoryId
        ]);
    }

    public function testRollbackStore()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn([
                'name' => 'test'
            ]);
        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);
        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasErrors = false;
        try {
            $controller->store($request);
        } catch(TestException $exception) {
            $this->assertCount(1, Genre::all());
            $hasErrors = true;
        }

        $this->assertTrue($hasErrors);
    }

    public function testRollbackUpdate()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller
            ->shouldReceive('findOrFail')
            ->withAnyArgs()
            ->andReturn($this->genre);
        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn([
                'name' => 'test'
            ]);
        $controller
            ->shouldReceive('rulesUpdate')
            ->withAnyArgs()
            ->andReturn([]);
        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasErrors = false;
        try {
            $controller->update($request, 1);
        } catch(TestException $exception) {
            $this->assertCount(1, Genre::all());
            $hasErrors = true;
        }

        $this->assertTrue($hasErrors);
    }

    public function testSyncCategories()
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();

        $sendData = [
            'name' => 'test',
            'categories_id' => [$categoriesId[0]]
        ];
        $response = $this->json('POST', $this->routeStore(), $sendData);
        $this->assertDatabaseHas('category_genre', [
            'category_id' => $categoriesId[0] ,
            'genre_id' => $response->json('id')
        ]);

        $sendData = [
            'name' => 'test',
            'categories_id' => [$categoriesId[1], $categoriesId[2]]
        ];
        $response = $this->json('PUT', route('genres.update', ['genre' => $response->json('id')]), $sendData);
        $this->assertDatabaseMissing('category_genre', [
            'category_id' => $categoriesId[0] ,
            'genre_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_genre', [
            'category_id' => $categoriesId[1] ,
            'genre_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_genre', [
            'category_id' => $categoriesId[2] ,
            'genre_id' => $response->json('id')
        ]);
    }

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $this->genre->id]));
        $response->assertStatus(204);
        $this->assertNull(Genre::find($this->genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
    }

    protected function routeStore() {
        return route('genres.store');
    }

    protected function routeUpdate() {
        return route('genres.update', ['genre' => $this->genre->id]);
    }

    protected function model() {
        return Genre::class;
    }

}
