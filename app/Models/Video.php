<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Genre;

class Video extends Model
{
    use SoftDeletes, Traits\Uuid;

    const RATING_LIST = ['L', '10', '14', '16', '18'];

    protected $fillable = ['title', 'description', 'year_launched', 'opened', 'rating', 'duration'];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'id' => 'string',
        'year_launched' => 'integer',
        'opened' => 'boolean',
        'duration' => 'integer'
    ];
    public $incrementing = false;

    public static function create(array $attributes = [])
    {
        try {
            \DB::beginTransaction();
            $createdObject = static::query()->create($attributes);
            static::handleRelations($createdObj, $attributes);
            \DB::commit();
            return $createdObject;
    } catch (\Exception $exception) {
            if (isset($createdObject)) {
                ;
            }
            \DB::rollBack();
            throw $exception;
        }
    }

    public function update(array $attributes = [], array $options = [])
    {
        try {
            \DB::beginTransaction();
            $saved = parent::update($attributes, $options);
            static::handleRelations($this, $attributes);
            if ($saved) {
                ;
            }
            \DB::commit();
            return $saved;
        } catch (\Exception $exception) {

            \DB::rollBack();
            throw $exception;
        }
    }

    public static function handleRelations(Video $video, array $attributes)
    {
        if (isset($attributes['categories_id'])) {
            $video->categories()->sync($attributes['categories_id']);
        }
        if (isset($attributes['genres_id'])) {
            $video->genres()->sync($attributes['genres_id']);
        }
    }

    public function categories() {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres() {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

}
