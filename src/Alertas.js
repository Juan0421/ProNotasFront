import Swal from "sweetalert2";
const AlertaInicio =(icon, title)=> Swal.fire({
    position: 'center',
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 1800
  })

  const AlertaAdvertencia =(confirmButtonText,action, mensaje, peticion )=>Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText
  }).then((result) => {
    
    if (result.isConfirmed) {
      peticion
      Swal.fire(
        action,
        mensaje,
        'success'
      )
    }
  })

export {AlertaInicio, AlertaAdvertencia}