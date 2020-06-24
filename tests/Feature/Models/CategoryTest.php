<?php

namespace Tests\Feature\Models;

use Ramsey\Uuid\Uuid as RamsayUuid;
use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        factory(Category::class, 1)->create();
        $categories = Category::all();
        $this->assertCount(1, $categories);
        $categoryKeys = array_keys($categories->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at', 'deleted_at'],
            $categoryKeys
        );
    }

    public function testCreate()
    {
        $category = Category::Create([
            'name' => 'test1'
        ]);
        $category->refresh();

        $this->assertTrue(RamsayUuid::isValid($category->id));
        $this->assertEquals('test1', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue($category->is_active);

        $category = Category::Create([
            'name' => 'test1',
            'description' => null
        ]);
        $this->assertNull($category->description);

        $category = Category::Create([
            'name' => 'test1',
            'description' => 'description test'
        ]);
        $this->assertEquals('description test', $category->description);

        $category = Category::Create([
            'name' => 'test1',
            'is_active' => false
        ]);
        $this->assertFalse($category->is_active);

        $category = Category::Create([
            'name' => 'test1',
            'is_active' => true
        ]);
        $this->assertTrue($category->is_active);
    }

    public function testUpdate()
    {
        $category = Category::Create([
            'name' => 'name test',
            'description' => 'description test',
            'is_active' => false
        ]);

        $data = [
            'name' => 'name test updated',
            'description' => 'description test updated',
            'is_active' => true
        ];
        $category->update($data);

        foreach($data as $key => $value){
            $this->assertEquals($value, $category->{$key});
        }
    }
}
