import React, {Fragment, useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import {useNavigate, useParams} from 'react-router-dom';
import clienteAxios from '../../config/axios';



function EditarCliente() {
    
    const { id } = useParams();

    console.log(id);

    let navigate = useNavigate();

    const[cliente, datosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    // Query a la API
    const consultarAPI = async () => {
        const clientesConsulta = await clienteAxios.get(`/clientes/${id}`)

        datosCliente(clientesConsulta.data);
    }

    useEffect(() => {
        consultarAPI();
    }, []);

    // leer los datos del formulario
    const actualizarState = e => {
        // Almacenar lo que el usuario escribe en el state
        datosCliente({
            ...cliente,
            [e.target.name] : e.target.value
        })

    }

    // Envia una peticion por axios para acutalizar el cliente
    const actualizarCliente = e => {
        e.preventDefault();

        // enviar peticion por axios
        clienteAxios.put(`/clientes/${cliente._id}`, cliente)
            .then(res => {
                if(res.data.code === 11000){
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'Ese cliente ya esta registrado'
                    })
                } else {
                    Swal.fire(
                        'Correcto',
                        'Se actualizó Correctamente',
                        'success'
                    )
                }
                // Redireccionar
                navigate('/', {replace: true});
            })
    }

    const validarCliente = () => {
        // Destructuring
        const { nombre, apellido, email, empresa, telefono} = cliente;

        // revisar que las propiedades del state tengan contenido
        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;

        // return true o false
        return valido
    }

    return ( 
        <Fragment>
            <h2>Nuevo Cliente</h2>

            <form onSubmit={actualizarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState} value={cliente.nombre}/>
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState} value={cliente.apellido}/>
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState} value={cliente.empresa}/>
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState} value={cliente.email}/>
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="tel" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState} value={cliente.telefono}/>
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Guardar Cambios" disabled={validarCliente()}/>
                </div>

            </form>
        </Fragment>
     );
}
 
export default EditarCliente;