
import Swal from 'sweetalert2'


function SwalFireHandler() {

    function swalFirePositive(message){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success!',
            text: message,
            showConfirmButton: false,
            timer: 1500
          })
    }
     function swalFireNegative(message){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
          })
     }

     return{
        swalFireNegative,
        swalFirePositive
     }
     

}

export default SwalFireHandler