import { BrowserRouter, Routes, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import {RecoilRoot} from "recoil";


const Admin = loadable(() => import('./timfreshAdmin'))

function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <Routes>
                    <Route>
                        <Route path='/' element={<Admin />} />
                        {/*<Route element={<Layout />}>*/}
                        {/*    <Route path='/' element={<Home />} />*/}
                        {/*    <Route path='/favorite' element={<Favorite />} />*/}
                        {/*</Route>*/}
                    </Route>
                </Routes>
            </BrowserRouter>
         </RecoilRoot>
    )
}

export default App
