<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{
    protected abstract function model();

    protected abstract function rulesStore();

    protected abstract function rulesUpdate();

    public function index()
    {
        return $this->model()::all();
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $createdObj = $this->model()::create($validatedData);
        $createdObj->refresh();
        return $createdObj;
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }

    public function show($id)
    {
        $findObj = $this->findOrFail($id);
        return $findObj;
    }

    public function update(Request $request, $id)
    {
        $updatedObj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $updatedObj->update($validatedData);
        return $updatedObj;
    }

    public function destroy($id)
    {
        $deletedObj = $this->findOrFail($id);
        $deletedObj->delete();
        return response()->noContent(); // 204
    }
}
