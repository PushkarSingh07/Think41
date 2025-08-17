import './App.css';
import CustomerList from './components/CustomerList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Management System</h1>
      </header>
      <main>
        <CustomerList />
      </main>
      <footer>
        <p>© 2025 Think41 - Customer Management System</p>
      </footer>
    </div>
  );
}

export default App;
