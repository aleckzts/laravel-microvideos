<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends BasicCrudController
{
    protected function model()
    {
        return Genre::class;
    }

    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean',
        'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL'
    ];

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $createdObj = \DB::transaction(function () use ($request, $validatedData, $self) {
            $createdObj = $this->model()::create($validatedData);
            $self->handleRelations($createdObj, $request);
            return $createdObj;
        });
        $createdObj->refresh();
        return $createdObj;
    }

    public function update(Request $request, $id)
    {
        $updatedObj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        \DB::transaction(function () use ($request, $validatedData, $self, $updatedObj) {
            $updatedObj->update($validatedData);
            $self->handleRelations($updatedObj, $request);
        });
        return $updatedObj;
    }

    protected function handleRelations($genre, Request $request)
    {
        $genre->categories()->sync($request->get('categories_id'));
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
