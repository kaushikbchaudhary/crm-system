import React from 'react';

//Next
import Router, { useRouter } from 'next/router';

//mui components
// import CircularProgress from '@mui/material/CircularProgress';

//context
import { useQuery } from '@tanstack/react-query';
// import { hasAccess, roleKeys } from 'components/utils';
import { apiContext } from '@/infrastructure/api/ApiContext';
import { useAuth } from '@/infrastructure/authentication/authContext';
// import { useNetworkStatus } from '@/infrastructure/hooks/useNetworkStatus';
// import { Box } from '@mui/material';
import {Skeleton} from "@/components/ui/skeleton";
import {hasAccess, roleKeys} from '@/components/utils';
import {useNetworkStatus} from "@/hooks/useNetworkStatus";
const { io } = require('socket.io-client');

const ProtectedRoute = ({
  publicPaths,
  children,
}: {
  publicPaths: string[];
  children: React.ReactElement;
}): JSX.Element => {
  const router = useRouter();

  const { user, setUser } = useAuth();
  const userRole = React.useMemo(() => user?.role || user?.userId?.role, [user?.role, user?.userId?.role]);
  //api function
  // @ts-ignore
  const { callApi, socket, setSocket } = React.useContext(apiContext);
  const networkStatus = useNetworkStatus();

  const [authorized, setAuthorized] = React.useState<boolean>(false);

  const { refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await callApi({ url: 'users/me', method: 'GET' })
      return response
    },
    enabled: !!user,
  });
  const path = React.useMemo(() => router.asPath.split('?')[0], [router.asPath]);

  const authCheck = React.useCallback(
    async (url: string) => {
      const path = url.split('?')[0];
      console.log('path: ', path);
      if (path === '/logout') {
        setAuthorized(false);
      } else if (path.includes('/embed/patients')) {
        setAuthorized(true);
      } else if (!user) {
        const data = await refetch();
        const resUser = data?.data?.data?.userData;
        if (data?.data?.data?.userData?.teleCRMSession) {
          // localStorage.setItem(LOCAL_STORAGE_KEYS.teleCRMSession, data?.data?.data?.userData?.teleCRMSession);
        }
        if (!resUser) { //authCheck function properly handles dynamic paths like /location/[patientId], preventing unnecessary redirections to the login page.
          const isPublicPath = publicPaths.some(publicPath => {
            if (publicPath.includes('/location/[patientId]')) {
              const dynamicPathRegex = new RegExp('^' + publicPath.replace('[patientId]', '[^/]+') + '$');
              return dynamicPathRegex.test(path);
            }
            return path === publicPath;
          });

          if (!isPublicPath && !publicPaths.includes(path) && !path.includes('/resetPassword/') && !path.includes('/register-doctor/')) {
            router.push({
              pathname: '/login',
            });
          } else {
            setAuthorized(true);
          }
        } else {
          setUser(resUser);
          // localStorage.setItem(LOCAL_STORAGE_KEYS.userId, resUser?.userId ?
          //   resUser?.userId?.id : resUser?.id)
        }
      } else if (user && userRole?.includes(roleKeys.superadmin) && !hasAccess(userRole, path, user, Router.query)) {
        // router.replace({
        //   pathname: '/dashboard',
        // });
      } else if (user && userRole?.includes(roleKeys.admin) && !hasAccess(userRole, path, user, Router.query)) {
        router.replace({
          pathname: '/dashboard',
        });
      } else if (user && !user.userId?.pendingProfile && !hasAccess(userRole, path, user, Router.query)) {
        // if user is not pending profile and has no access to the path, redirect to home
        console.log('if user is not pending profile and has no access to the path, redirect to home');


        // for superadmin and admin, redirect to home
        if (userRole?.includes(roleKeys.superadmin)) {
          router.replace({
            pathname: '/dashboard',
          });
        } else if (userRole?.includes(roleKeys.doctor)) {
          router.replace({
            pathname: '/patients',
          });
        } else if (userRole?.includes(roleKeys.staff)) {
          // for doctor, redirect to patients
          router.replace({
            pathname: '/wards',
          });
        }
        // else if (userRole?.includes(roleKeys.distributor)) {
        //   // for doctor, redirect to patients
        //   router.replace({
        //     pathname: '/dashboard',
        //   });
        // } 
        else {
          setAuthorized(true);
        }
      }
      // else if (user && userRole?.includes(roleKeys.admin) && user.locationsCount === 0 && path !== '/branches') {
      //    router.replace({
      //      pathname: '/branches',
      //    });
      // }
      // else if (user && user?.pendingProfile === true && path !== '/devices/profile') {
      //   router.replace({
      //     pathname: '/devices/profile',
      //   });
      // } 
      else {
        setAuthorized(true);
      }
    },
    [user, userRole, refetch, publicPaths, router, setUser]
  );

  React.useEffect(() => {
    authCheck(router.asPath);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCheck]);

  React.useEffect(() => {
    if (networkStatus === 'Offline') {
      location.reload();
    }
  }, [networkStatus]);

  React.useEffect(() => {
    if (
      authorized &&
      !socket &&
      !publicPaths.includes(path) &&
      !path.includes('/resetPassword/') &&
      !path.includes('/register-doctor/')
    ) {
      const socket1 = io(process.env.NEXT_PUBLIC_SOCKETURL, {
        withCredentials: true,
        transports: ['websocket'],
      });
      setSocket(socket1);
    } else if (socket && !authorized) {
      setSocket(null);
    }
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [authorized, path, publicPaths, setSocket, socket]);

  return authorized ? (
    children
  ) : (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/*<CircularProgress*/}
      {/*  disableShrink*/}
      {/*  sx={{*/}
      {/*    position: 'absolute',*/}
      {/*    top: '47%',*/}
      {/*    left: '47%',*/}
      {/*    animationDuration: '350ms',*/}
      {/*  }}*/}
      {/*  size={40}*/}
      {/*  thickness={4}*/}
      {/*/>*/}
      <Skeleton/>
    </div>
  );
};
export default ProtectedRoute;
