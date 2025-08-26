import { Outlet } from "react-router-dom";
import {
  AppLayout,
  Content,
  ContentHeader,
  Sidebar,
} from "./layouts/AppLayout";
import { Navbar } from "./components/navbar";
import { Toaster } from "./components/ui/toaster";
function App() {
  return (
    <AppLayout className="">
      <Sidebar className="flex flex-col items-center justify-center">
        <Navbar />
      </Sidebar>
      <Content className="flex items-center justify-center flex-col m-2 mb-4 gap-2">
        <ContentHeader className="" />
        <Outlet />
      </Content>
      <Toaster />
    </AppLayout>
  );
}

export default App;
