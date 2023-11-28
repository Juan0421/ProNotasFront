const token = localStorage.getItem('token')
const headers = { headers: { 'authorization': `Bearer ${token}` } };

export default headers