<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CastMemberUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testFillables()
    {
        $fillable = ['name', 'type'];
        $castMember = new CastMember();
        $this->assertEquals($fillable, $castMember->getFillable());
    }

    public function testCasts()
    {
        $casts = [
            'id' => 'string',
            'type' => 'integer'
        ];
        $castMember = new CastMember();
        $this->assertEquals($casts, $castMember->getCasts());
    }

    public function testDates()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $castMember = new CastMember();
        foreach ($dates as $date) {
            $this->assertContains($date, $castMember->getDates());
        }
        $this->assertCount(count($dates), $castMember->getDates());
    }

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $castMemberTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($traits, $castMemberTraits);
    }

    public function testIncrementing()
    {
        $castMember = new CastMember();
        $this->assertFalse($castMember->incrementing);
    }
}
