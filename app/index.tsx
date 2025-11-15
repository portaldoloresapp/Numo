import { Redirect } from 'expo-router';

export default function RootIndex() {
  // Redireciona para a tela inicial dentro do layout de abas.
  return <Redirect href="/(tabs)/" />;
}
