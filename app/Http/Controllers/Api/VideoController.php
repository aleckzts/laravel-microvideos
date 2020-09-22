<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\Videos;

class CategoryController extends BasicCrudController
{
    protected function model()
    {
        return Videos::class;
    }

    private $rules = [
        'title' => 'required|max:255',
        'description' => 'nullable',
        'opened' => 'boolean'
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
