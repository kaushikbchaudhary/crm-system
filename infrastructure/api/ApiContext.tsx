// import { useSnackbar } from 'components/common/snackbar/useSnackbar';
// import { PUBLIC_PATHS, REGISTRATION_PATHS } from 'infrastructure/constants/routes';
import Router from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {PUBLIC_PATHS, REGISTRATION_PATHS} from "@/infrastructure/constants/routes";

interface Props {
  callApi: any;
  callImageApi: any;
  callApiMultiPart: any;
  dupliChecker: any;
  socket: any;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
}
export const apiContext = React.createContext<Props | null>(null);
const ApiProvider = (props: {
  children:
  | string
  | number
  | boolean
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactFragment
  | React.ReactPortal;
  user: any;
  setUser: any;
}) => {
  // const { onErrorAlert } = useSnackbar();
  const { t, i18n } = useTranslation('common', { useSuspense: false });
  const [socket, setSocket] = React.useState(null);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let count = 0;
  // let isRefreshing = false;
  // let refreshSubscribers = [];
  /**
   * axios instance configuration
   */
  const apiInstance: any = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    // baseURL: 'https://192.168.1.111:3000/api/v1/',
  });

  /**
   * axios middlewar, passes token in request header on every call
   */
  apiInstance.interceptors.request.use((config: any) => {
    const path = Router.pathname.split('?')[0];
    if (REGISTRATION_PATHS.includes(path) && !path.includes('/resetPassword/')) {
      const otpToken = process.browser && localStorage.getItem('otpAuth');
      if (otpToken) {
        config.headers.Authorization = `Bearer ${otpToken}`;
      }
    }
    config.headers['accept-language'] = i18n.language;
    config.headers['timezone'] = timezone;
    config.withCredentials = true;
    return config;
  });

  // apiInstance_1.interceptors.request.use((config: any) => {
  //   config.headers['accept-language'] = i18n.language;
  //   config.headers['timezone'] = timezone;
  //   config.withCredentials = true;
  //   return config;
  // });

  //manage interceptor response for error code 401(for jwt token expired)
  apiInstance.interceptors.response.use(
    (response: any) => {
      return response.data;
    },
    async function (error: any) {
      if (error?.code === 'ERR_NETWORK') {
        console.log('no internet connection!')
        // onErrorAlert({ message: 'No Internet Connection!' });
      }
      const path = Router.pathname;
      if (
        error.response?.status === 401 &&
        !PUBLIC_PATHS.includes(path) &&
        !path.includes('/resetPassword/') &&
        !path.includes('/register-doctor/') &&
        !path.includes('/logout') &&
        !error?.config?.url.includes('refreshToken')
      ) {
        const originalRequest = error.config;
        if (!originalRequest?._retry) {
          const token = await refreshAccessToken();
          if (token) {
            originalRequest._retry = true;
            return apiInstance(originalRequest);
          } else {
            return Promise.reject(error);
          }
        } else {
          return Promise.reject(error);
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  interface CallApiRequest {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'GET';
    body?: any;
    responseType?: 'json' | 'blob' | 'arraybuffer' | 'document' | 'text';
    formData?: FormData;
    auth?: {
      username: string;
      password: string;
    };
  }

  const tokrnCsrf = async () => {
    try {
      const token = await callApi({
        url: `utils/form/csrfToken`,
        method: 'get',
      });
      return token; // Optionally return the token if needed elsewhere
    } catch (error: any) {
      console.error('Error fetching CSRF token:', error.message);
      throw error;
    }
  };

  // let token;
  // token = await callApi({
  //   url: `utils/form/csrfToken`,
  //   method: 'get',
  // });
  // console.log('token:>>>>123', token);

  async function refreshAccessToken() {
    try {
      const token = await tokrnCsrf();

      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_BASEURL}users/refreshToken`,
        data: { user: props?.user?.userId?.id ? props?.user?.userId?.id : props.user._id },// localStorage.getItem(LOCAL_STORAGE_KEYS.userId) - user: props.user?.userId?.id ? props.user.userId.id : props.user._id
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': token.data.csrfToken
          // ...(token && token?.data?.csrfToken && { 'x-csrf-token': token.data.csrfToken })
        },
      });
      
      if (response?.data?.data?.token) {
        return response?.data?.data?.token;
      } else {
        console.log('154');
        handleAuthenticationFailure()
      }
    } catch (error: any) {
      console.log('164', error);
      handleAuthenticationFailure()
    }
  }

  function handleAuthenticationFailure() {
    if (socket) {
      // socket.disconnect();
      // setSocket(null);
    }
    props.setUser(null);
    localStorage.clear();
    // Router.replace('/login');

    location.replace('/login');
  }

  // API for simple data (json) function
  const callApi = async (values: any) => {

    console.log('values-------->>',values);
    let token;
    // if (values !== undefined && values?.method !== undefined && values?.method.toLowerCase() !== "get" && values?.method !== "GET") {
    //   token = await callApi({
    //     url: `utils/form/csrfToken`,
    //     method: 'get',
    //   });
    // }
    return apiInstance({
      url: values?.url,
      method: values?.method,
      data: values?.body,
      responseType: values?.responseType || 'json',
      formData: values?.formData,
      headers: {
        'Content-Type': 'application/json',
        // ...(token && token?.data?.csrfToken && { 'x-csrf-token': token.data.csrfToken })
      },
      auth: values?.auth,
    });
  };

  //API for file upload
  const callApiMultiPart = async (values: any) => {
    let token;
    if (values !== undefined && values?.method !== undefined && values?.method.toLowerCase() !== "get" && values?.method !== "GET") {
      token = await callApi({
        url: `utils/form/csrfToken`,
        method: 'get',
      });
    }

    return apiInstance({
      url: values?.url,
      method: values?.method,
      data: values?.formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && token?.data?.csrfToken && { 'x-csrf-token': token.data.csrfToken })
      },
    });
  };

  //Api for Get blob
  const callImageApi = (values: CallApiRequest) => {
    return apiInstance({
      url: values?.url,
      method: values?.method,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  //for check duplicate
  const dupliChecker = (key: string, value: string) => {
    if (key === 'email') {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regex.test(value)) {
        const duplicate = callApi({ url: `utils/findDuplicate/users/?email=${value}`, method: 'get' })
          .then((res: { data: { found: boolean } }) => {
            if (res.data.found === true) {
              return res.data;
            } else {
              return res.data;
            }
          })
          .catch(() => { });

        return duplicate;
      } else {
        return { message: t('enter valid email'), found: true };
      }
    } else if (key === 'contact') {
      const duplicate: any = callApi({ url: `utils/findDuplicate/users/?contact=${parseInt(value)}`, method: 'get' })
        .then((res: { data: { found: boolean } }) => {
          if (res.data.found === true) {
            return res.data;
          } else {
            return res.data;
          }
        })
        .catch(() => { });

      return duplicate;
    }
  };

  // React.useEffect(() => {
  //   if (socket) {
  //     socket.on('connect_error', eror => {
  //       console.log('socket  connect_error ... ', eror.message);
  //     });
  //     socket.on('connect', () => {
  //       console.log('socket connected ... ');
  //     });
  //     socket.on('disconnect', () => {
  //       console.log('socket disconnected ... ');
  //     });
  //   }
  // }, [socket]);

  return (
    <apiContext.Provider value={{ callApi, callApiMultiPart, callImageApi, dupliChecker, socket, setSocket } as any}>
      {props.children}
    </apiContext.Provider>
  );
};

export default ApiProvider;
