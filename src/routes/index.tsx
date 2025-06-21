// Se existe um arquivo de rotas separado, certifique-se de que inclui:
import { Route } from 'react-router-dom';
import Documents from '@/pages/Documents';

// E nas rotas:
<Route path="/documents" element={<Documents />} />