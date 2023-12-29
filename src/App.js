import React, {Fragment, useContext} from 'react';
// Routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/** Layout */
import Header from './componentes/layout/Header';
import Navegacion from './componentes/layout/Navegacion';  

/**Clientes */
import Clientes from './componentes/clientes/Clientes';
import NuevoCliente from './componentes/clientes/NuevoCliente';
import EditarCliente from './componentes/clientes/EditarCliente';

/**Productos */
import Productos from './componentes/productos/Productos';
import EditarProducto from './componentes/productos/EditarProducto';
import NuevoProducto from './componentes/productos/NuevoProducto';

/**Pedidos */
import Pedidos from './componentes/pedidos/Pedidos';
import NuevoPedido from './componentes/pedidos/NuevoPedido';

/**Autenticacion */
import Login from './componentes/auth/Login';

import { CRMContext, CRMProvider } from './context/CRMContext';


function App() {
  // utilizar context en el componente
  const [auth, guardarAuth] = useContext(CRMContext)

  return (
    <Router>
      <Fragment>
        <CRMProvider value={[ auth, guardarAuth ]}>
          <Header />

          <div className="grid contenedor contenido-principal">
              <Navegacion/>

              <main className="caja-contenido col-9">
                  <Routes>
                      <Route path="/" element={<Clientes/>} />
                      <Route path="/clientes/nuevo" element={<NuevoCliente/>} />
                      <Route path="/clientes/editar/:id" element={<EditarCliente/>} />

                      <Route path="/productos" element={<Productos/>} />
                      <Route path="/productos/nuevo" element={<NuevoProducto/>} />
                      <Route path="/productos/editar/:id" element={<EditarProducto/>} />

                      <Route path="/pedidos" element={<Pedidos/>} />
                      <Route path="/pedidos/nuevo/:id" element={<NuevoPedido/>} />

                      <Route path="/iniciar-sesion" element={<Login/>} />
                  </Routes>
              </main>
          </div>
        </CRMProvider>
      </Fragment>
    </Router>
  )
}

export default App;
