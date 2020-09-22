<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\Genre;

class GenreController extends BasicCrudController
{
    protected function model()
    {
        return Genre::class;
    }

    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean'
    ];

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
