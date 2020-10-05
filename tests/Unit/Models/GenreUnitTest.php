<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testFillables()
    {
        $fillable = ['name', 'is_active'];
        $genre = new Genre();
        $this->assertEquals($fillable, $genre->getFillable());
    }

    public function testCasts()
    {
        $casts = [
            'id' => 'string',
            'is_active' => 'boolean'
        ];
        $genre = new Genre();
        $this->assertEquals($casts, $genre->getCasts());
    }

    public function testDates()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $genre = new Genre();
        foreach ($dates as $date) {
            $this->assertContains($date, $genre->getDates());
        }
        $this->assertCount(count($dates), $genre->getDates());
    }

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $genreTraits = array_keys(class_uses(Genre::class));
        $this->assertEquals($traits, $genreTraits);
    }

    public function testIncrementing()
    {
        $genre = new Genre();
        $this->assertFalse($genre->incrementing);
    }
}
