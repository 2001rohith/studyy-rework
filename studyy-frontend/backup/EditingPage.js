const response = await fetchCourses(user.id, {
    page: currentPage,
    limit: itemsPerPage,
    search: search || '',
    modulesFilter: modulesFilter || '',
});