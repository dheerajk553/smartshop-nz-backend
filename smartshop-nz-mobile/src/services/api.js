const BASE_URL = 'http://10.0.0.22:3000/v1';
let apiBase = BASE_URL; // change for emulator (10.0.2.2) or device

async function request(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, options);
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const body = contentType.includes('application/json') ? await res.json() : await res.text();
    const err = new Error(`Request failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export function setApiBase(url) {
  apiBase = url;
}

export async function getProducts() {
  return request('/products');
}

export async function getPrices(productId) {
  return request(`/products/${productId}/prices`);
}

export default { setApiBase, getProducts, getPrices };
