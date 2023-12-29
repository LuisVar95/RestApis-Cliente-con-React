import React, {useState, useContext} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';


function Login(){

    const [auth, guadarAuth] = useContext(CRMContext)

    const navigate = useNavigate();

    // State con los datos del formulario
    const [ credenciales, guardarCredenciales] = useState({})

    // iniciar sesion en el servidor
    const iniciarSesion = async e => {
        e.preventDefault();

        // autenticar al usuario

        try {
            
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);
            
            // extraer el token y colocarlo en localStorge
            const { token } = respuesta.data;
            localStorage.setItem('token', token);

            // colocarlo en el state
            guadarAuth({
                token, 
                auth: true
            })

            //alerta
            Swal.fire(
                'Login Correcto', 
                'Has iniciado Sesion',
                'success'
            )

            navigate('/')

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: 'Hubo un error',
                text: error.response.data.mensaje
            })
        }
    }

    // almacenar lo que el usuario escribe en el state
    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }

    return(
        <div className='login'>
            <h2>Iniciar Sesion</h2>

            <div className='contenedor-formulario'>
                <form onSubmit={iniciarSesion}>

                    <div className='campo'>
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Email para Iniciar Sesion"
                            required
                            onChange={leerDatos}
                        />
                    </div>
                    <div className='campo'>
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesion"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <input type="submit" value="Iniciar Sesion" className="btn btn-verde btn-block"/>
                </form>
            </div>
        </div>
    )
}

export default Login;