import React, { useEffect, useState, Fragment, useContext } from 'react';
// importar cliente axios
import clienteAxios from '../../config/axios'
import Cliente from './Cliente';
import Spinner from '../layout/Spinner';
import { Link, useNavigate } from 'react-router-dom';

// import el Context
import { CRMContext } from '../../context/CRMContext';

const Clientes = () => {

    const navigate = useNavigate()

    const [clientes, guardarClientes] = useState([]);

    // utilizar valores del context
    const [auth, guardarAuth] = useContext(CRMContext)

    console.log(auth)


    // Se ejecuta useEffect al entrar al componente, solo si tiene las dependencias vacias []
    useEffect(() => {

        if(auth.token !== ''){
            // Query a la API
            const consultarAPI = async () => {
                try {
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization : `Bearer ${auth.token}`
                        }
                    });
    
                    guardarClientes(clientesConsulta.data)
                } catch (error) {
                    if(error.response.status = 500){
                        navigate('/iniciar-sesion')
                    }
                }
                
        }
            consultarAPI();
        } else {
            navigate('/iniciar-sesion')
        }
    }, [clientes]);

    // Si el state esta como false
    if(!auth.auth){
        navigate('/iniciar-sesion')
    }

   


    return (
        <Fragment>
            <h2>Clientes</h2>

            <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>
            <ul className='listado-clientes'> 
                {clientes.map(cliente => (
                    <Cliente 
                        key={cliente._id}
                        cliente={cliente}
                    />
                ))}
            </ul>
        </Fragment>
    )
}
export default Clientes;