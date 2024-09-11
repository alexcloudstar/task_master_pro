import { routes } from '@/lib/constants';
import { Link } from '@tanstack/react-router';

const Navigation = () => {
  return (
    <nav className='flex items-center justify-between gap-5'>
      <div>
        <Link to='/'>
          <h1 className='font-medium'>Task Master Pro</h1>
        </Link>
      </div>
      <div className='flex items-center justify-center gap-5'>
        {routes.map(({ id, to, label }) => (
          <Link key={id} to={to} className='[&.active]:font-bold'>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
