<?php

namespace Tests\Feature\Models;

use Ramsey\Uuid\Uuid as RamsayUuid;
use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CastMemberUnitTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();
        $this->assertCount(1, $castMembers);
        $castMembersKeys = array_keys($castMembers->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            ['id', 'name', 'type', 'created_at', 'updated_at', 'deleted_at'],
            $castMembersKeys
        );
    }

    public function testCreate()
    {
        $castMember = CastMember::Create([
            'name' => 'test1',
            'type' => CastMember::TYPE_DIRECTOR
        ]);
        $castMember->refresh();

        $this->assertTrue(RamsayUuid::isValid($castMember->id));
        $this->assertEquals('test1', $castMember->name);
        $this->assertEquals(CastMember::TYPE_DIRECTOR, $castMember->type);

        $castMember = CastMember::Create([
            'name' => 'test1',
            'type' => CastMember::TYPE_ACTOR
        ]);
        $this->assertEquals(CastMember::TYPE_ACTOR, $castMember->type);
    }
    public function testUpdate()
    {
        $castMember = CastMember::Create([
            'name' => 'name test',
            'type' => CastMember::TYPE_DIRECTOR
        ]);

        $data = [
            'name' => 'name test updated',
            'type' => CastMember::TYPE_ACTOR
        ];
        $castMember->update($data);

        foreach($data as $key => $value){
            $this->assertEquals($value, $castMember->{$key});
        }
    }

    public function testDelete()
    {
        $castMember = factory(CastMember::class)->create();
        $castMember->delete();
        $this->assertNull(CastMember::find($castMember->id));

        $castMember->restore();
        $this->assertNotNull(CastMember::find($castMember->id));
    }
}
