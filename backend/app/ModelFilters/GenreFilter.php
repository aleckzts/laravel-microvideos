<?php

namespace App\ModelFilters;

use App\ModelFilters\DefaultModelFilter;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }
}
