-- La búsqueda de texto (US-02) ignora mayúsculas y tildes: "cafe" encuentra "Café" (D-51).
-- unaccent viene con PostgreSQL (módulo contrib) y Supabase la ofrece también.
CREATE EXTENSION IF NOT EXISTS unaccent;
