import React, {useEffect, useState, Fragment, useContext} from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Producto from './Producto';
import Spinner from '../layout/Spinner';

// import el Context
import { CRMContext } from '../../context/CRMContext';

 
const Productos = () => {

    // productos = state, guardarproductos = funcion para guardarel state
    const [productos, guardarProductos] = useState([]);

     // utilizar valores del context
     const [auth, guardarAuth] = useContext(CRMContext)

    // useEffect para consular api cuando cargue
    useEffect(() => {

       if(auth.token !== ''){
         // Query a la API
         const consultarAPI = async () => {
            try {
                const productosConsulta = await clienteAxios.get('/productos',  {
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                        }
                    });
                guardarProductos(productosConsulta.data);
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
    }, [productos]);

    // Si el state esta como false
    if(!auth.auth){
        navigate('/iniciar-sesion')
    }


    return ( 
        <Fragment>
            <h2>Productos</h2>

            <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
               {productos.map(producto => (
                <Producto
                    key={producto._id}
                    producto={producto}
                />
               ))}
            </ul>
        </Fragment>
     );
}
 
export default Productos;