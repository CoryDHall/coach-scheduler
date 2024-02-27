
export function errorResponse(e: unknown, errorCategory: string) {
  console.error(e);
  return new Response(JSON.stringify(createErrorResponse(errorCategory, e)), { status: 500 });
}

export function createErrorResponse(errorCategory: string, e: unknown) {
  if (typeof e === 'string') {
    return { error: [errorCategory, e] };
  }
  const _e = e as Error;
  return {
    error: [
      errorCategory,
      { ..._e, message: _e.message, stack: _e.stack?.split(/\n/) ?? [] },
    ],
  };
}

export async function jsonQueryResponse<T>(query: Promise<T>) {
  const data = await query;
  return new Response(JSON.stringify(data));
}

export async function jsonResponse<T>(result: Promise<T>, errorCategory: string) {
  try {
    return await jsonQueryResponse(result);
  } catch (e: unknown) {
    return errorResponse(e, errorCategory);
  }
}
