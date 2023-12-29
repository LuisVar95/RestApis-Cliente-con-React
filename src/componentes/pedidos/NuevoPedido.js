import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';



function NuevoPedido(){

    const navigate = useNavigate()

    // extraer el ID de cliente
    const { id } = useParams()
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() => {
        // obtener el cliente
        const consultarAPI= async () => {
            // consultar el cliente actual
            const resultado = await clienteAxios.get(`/clientes/${id}`)
            guardarCliente(resultado.data)
        }
        //llamar a la api
        consultarAPI();

    }, []);

    // useEffect para actualizar el total cada vez que producto cambie
    useEffect(() => {

        actualizarTotal();

    }, [productos])

    const buscarProducto = async e => {
        e.preventDefault();

        // obtener los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);

        if(resultadoBusqueda.data.producto[0]) {

            let productoResultado = resultadoBusqueda.data.producto[0];
            // agregar la llave "producto"
            productoResultado.producto = resultadoBusqueda.data.producto[0]._id;
            productoResultado.cantidad = 0;

            // ponerlo en el state
            guardarProductos([...productos, productoResultado]);

        } else {
            // no hay resultados
            Swal.fire({
                icon: 'error',
                title: 'No Resultados',
                text: 'No hay resultados'
            })
        } 
    }

    const leerDatosBusqueda = e => {
        guardarBusqueda( e.target.value );
    }

    // actualizar la cantidad de productos
    const restarProductos = i => {
        // copiar el arreglo original de productos
        const todosProductos = [...productos];

        // validar si esta en 0 no puee ir mas alla
        if(todosProductos[i].cantidad === 0) return;

        // decremento
        todosProductos[i].cantidad--;

        // almacenarlo en el state
        guardarProductos(todosProductos)

    }

    const aumentarProductos = i => {
        // copiar el arreglo para no mutar el original
        const todosProductos = [...productos];

        // incremento
        todosProductos[i].cantidad++;

        // almacenarlo en el state
        guardarProductos(todosProductos);
    }

    // Elimina un producto del state
    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id);

        guardarProductos(todosProductos)
    }

    // Actualizar el total a pagar
    const actualizarTotal = () => {
        // si el arreglo de productos es igual 0: el total es 0
        if(productos.length === 0) {
            guardarTotal(0);
            return
        }

        // calcular el nuevo total
        let nuevoTotal = 0;

        // recorrer todos los productos, sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

        // almacenar el total
        guardarTotal(nuevoTotal)
    }

    // Almacena el pedido en la BD
    const realizarPedido = async e => {
        e.preventDefault();

        // construir el objeto
        const pedido = {
            "cliente" : id,
            "pedido" : productos,
            "total" : total
        }
        
        // almacenarlo en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

        // leer resultado
        if(resultado.status === 200) {
            // alerta de todo bien 
            Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        } else {
            //alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Error',
                text: 'Vuelva a intentarlo'
            })
        }

        // redireccionar 
        navigate('/pedidos')
    }



    return (
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nomobre: {cliente.nombre} {cliente.apellido}</p>
                <p>Telefono: {cliente.telefono}</p>
            </div>

            <FormBuscarProducto
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

            <ul className="resumen">
                {productos.map((producto, index) => (
                    <FormCantidadProducto
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        aumentarProductos={aumentarProductos}
                        eliminarProductoPedido={eliminarProductoPedido}
                        index={index}
                    />
                ))}
            </ul>
                <p className='total'>Total a Pagar: <span>${total}</span></p>
                { total > 0 ? (
                    <form onSubmit={realizarPedido}>
                        <input type="submit" className='btn btn-verde btn-block' value="Realizar Pedido"/>
                    </form>
                ) : null }
        </Fragment>
    )
}
export default NuevoPedido;