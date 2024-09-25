import { Link, useLocation } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Fragment } from 'react/jsx-runtime';

const BreadcrumbNav = () => {
  const { pathname } = useLocation();
  const pathArr = [...new Set(pathname.split('/'))];

  return (
    <Breadcrumb className='w-full hidden md:flex'>
      <BreadcrumbList className='capitalize'>
        {pathArr.map((path, idx) => {
          const computedPath = path === '' ? 'dashboard' : path;

          if (idx === pathArr.length - 1) {
            return (
              <BreadcrumbItem key={idx}>
                <BreadcrumbPage>{computedPath}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <Fragment key={idx}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/${path}`}>{computedPath}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
