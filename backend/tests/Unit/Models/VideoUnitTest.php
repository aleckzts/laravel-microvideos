<?php

namespace Tests\Unit\Models;

use App\Models\Video;
use App\Models\Traits\Uuid;
use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VideoUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testFillables()
    {
        $fillable = [
            'title',
            'description',
            'year_launched',
            'opened',
            'rating',
            'duration',
            'video_file',
            'thumb_file',
            'banner_file',
            'trailer_file',
        ];
        $video = new Video();
        $this->assertEquals($fillable, $video->getFillable());
    }

    public function testCasts()
    {
        $casts = [
            'id' => 'string',
            'year_launched' => 'integer',
            'opened' => 'boolean',
            'duration' => 'integer'
        ];
        $video = new Video();
        $this->assertEquals($casts, $video->getCasts());
    }

    public function testDates()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $video = new Video();
        foreach ($dates as $date) {
            $this->assertContains($date, $video->getDates());
        }
        $this->assertCount(count($dates), $video->getDates());
    }

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class, UploadFiles::class
        ];
        $videoTraits = array_keys(class_uses(Video::class));
        $this->assertEquals($traits, $videoTraits);
    }

    public function testIncrementing()
    {
        $video = new Video();
        $this->assertFalse($video->incrementing);
    }
}
