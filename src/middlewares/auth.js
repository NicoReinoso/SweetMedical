// middleware/auth.js  (Express)
export function verificarToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return 
res.status(401).json({ error: 'Token requerido' });

  try {
    const 
payload = jwt.verify(
      auth.split(
' ')[1],
      process.env.JWT_SECRET
    );
    req.user = payload;
    
next();
  } catch {
    res.status(
401).json({ error: 'Token inválido' });
  }
};
