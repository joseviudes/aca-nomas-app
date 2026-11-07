// Corre antes de cada archivo de pruebas. Las pruebas no dependen de las variables de tu máquina
// ni del contenedor: dentro de Docker, API_INTERNAL_URL está definida (D-33) y cambiaría la URL
// que arma el http-client. Cada prueba que necesita una variable la define con vi.stubEnv.
delete process.env.API_INTERNAL_URL;
delete process.env.NEXT_PUBLIC_API_URL;
