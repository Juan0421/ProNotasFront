let apiUrl = 'http://localhost:3000/'

if(import.meta.env.VITE_APP_API === 'production'){
    apiUrl = import.meta.env.VITE_APP_API 
}

export default apiUrl