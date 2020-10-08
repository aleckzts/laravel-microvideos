<?php

namespace Tests\Feature\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use Tests\Stubs\Models\CategoryStub;
use Tests\Stubs\Controllers\CategoryStubController;
use App\Http\Controllers\Api\BasicCrudController;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BasicCrudControllerTest extends TestCase
{
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();
        $this->controller = new CategoryStubController();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex()
    {
        $categoryStub = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $result = $this->controller->index()-> toArray();
        $this->assertEquals([$categoryStub->toArray()], $result);
    }

    public function testInvalidationDataInStore()
    {
        $this->expectException(ValidationException::class);
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => '']);
        $this->controller->store($request);
    }

    public function testStore() {
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test_name', 'description' => 'test_description']);

        $obj = $this->controller->store($request);
        $this->assertEquals(
            CategoryStub::find(1)->toArray(),
            $obj->toArray()
        );
    }

    public function testIfFindOrFailFetchModel()
    {
        $categoryStub = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);

        $reflectionClass = new\ ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod-> invokeArgs($this->controller, [$categoryStub->id]);
        $this->assertInstanceOf(CategoryStub::class, $result);
    }

    public function testIfFindOrFailThrowExceptionWhenIdInvalid()
    {
        $this->expectException(ModelNotFoundException::class);

        $reflectionClass = new\ ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $reflectionMethod-> invokeArgs($this->controller, [0]);

    }

    public function testShow()
    {
        $categoryStub = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $result = $this->controller->show($categoryStub->id);
        $this->assertEquals($result->toArray(), CategoryStub::find(1)->toArray());
    }

    public function testUpdate()
    {
        $categoryStub = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test_changed', 'description' => 'test_description_changed']);
        $result = $this->controller->update($request, $categoryStub->id);
        $this->assertEquals($result->toArray(), CategoryStub::find(1)->toArray());

    }

    public function testDestroy()
    {
        $categoryStub = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $response = $this->controller->destroy($categoryStub->id);
        $this->createTestResponse($response)
            ->assertStatus(204);
        $this->assertCount(0, CategoryStub::all());
    }
}
