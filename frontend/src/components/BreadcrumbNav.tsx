import { Link, useLocation } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

const BreadcrumbNav = () => {
  const { pathname } = useLocation();
  const pathArr = [...new Set(pathname.split('/'))];

  return (
    <Breadcrumb className='hidden md:flex'>
      <BreadcrumbList className='capitalize'>
        {pathArr.map((path, idx) => {
          const computedPath = path === '' ? 'home' : path;

          if (idx === pathArr.length - 1) {
            return (
              <BreadcrumbItem key={idx}>
                <BreadcrumbPage>{computedPath}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/${path}`}>{computedPath}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
