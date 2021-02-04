<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Eloquent\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BasicCrudController extends Controller
{
    protected $defaultPerPage = 15;

    protected abstract function model();

    protected abstract function rulesStore();

    protected abstract function rulesUpdate();

    protected abstract function resource();

    protected abstract function resourceCollection();

    public function index(Request $request) {
        $perPage = (int) $request->get('per_page', $this->defaultPerPage);
        $hasFilter = in_array('EloquentFilter\Filterable', class_uses($this->model()));
        // dd($hasFilter, class_uses_recursive($this->model()));

        $query = $this->queryBuilder();

        if ($hasFilter) {
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$perPage
            ? $query->get()
            : $query->paginate($perPage);

        $resourceCollectionClass = $this->resourceCollection();

        $refClass = new \ReflectionClass($this->resourceCollection());

        return $refClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $createdObj = $this->queryBuilder()->create($validatedData);
        $createdObj->refresh();
        $resource = $this->resource();

        return new $resource($createdObj);
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->queryBuilder()->where($keyName, $id)->firstOrFail();
    }

    public function show($id)
    {
        $findObj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($findObj);
    }

    public function update(Request $request, $id)
    {
        $updatedObj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $updatedObj->update($validatedData);

        $resource = $this->resource();

        return new $resource($updatedObj);
    }

    public function destroy($id)
    {
        $deletedObj = $this->findOrFail($id);
        $deletedObj->delete();
        return response()->noContent(); // 204
    }

    protected function queryBuilder(): Builder{
        return $this->model()::query();
    }
}
