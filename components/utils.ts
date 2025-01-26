import _ from 'lodash';

import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

// api function
// eslint-disable-next-line react-hooks/rules-of-hooks

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    if (file) {
      // resolve(file);
      const reader = new FileReader();
      reader?.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    }
  });
}

export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}

export const roleKeys = {
  admin: 'admin',
  doctor: 'doctor',
  patient: 'patient',
  staff: 'staff',
  superadmin: 'super-admin',
  telecaller: 'telecaller',
  distributor: 'distributor',
  deliveryBoy: 'deliveryBoy',
};
export const superAdminAccess = ['/devices/devices', '/devices/clinics', '/devices/patients', '/dashboard'];
export function hasAccess(role: Array<string>, path: string, user: any, query: ParsedUrlQuery) {
  const pathAccess = {
    '/dashboard': [roleKeys.superadmin, roleKeys.admin],

  };
  const hasAccess = role?.some(role => {
    // @ts-ignore
    return pathAccess[path]?.includes(role);
  });
  // if (hasAccess && path === '/devices/patients' && !user?.mainClinic?.id) {
  //   hasAccess = false;
  // }
  // if (hasAccess && path === '/devices/ecg-patients' && !user?.mainClinic?.id) {
  //   hasAccess = false;
  // }
  return hasAccess;
}

export const capitalizeFirstLowercaseRest = (str: string) => {
  if (str) {
    const words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i] && words[i] !== 'undefined' && words[i] !== 'null'
          ? words[i][0].toUpperCase() + words[i].slice(1).toLowerCase()
          : '';
    }
    return words.join(' ');
  } else {
    return '';
  }
};
export const spaceValidationFunction = (e:any, removeSpace?: boolean) => {
  if (removeSpace) {
    return (e.target.value = e?.target?.value?.replace(/[ ]{1,}/gi, ''));
  }
  return (e.target.value = e?.target?.value?.replace(/[ ]{2,}/gi, ' '));
};

export const commonRegex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

// devices to patients change
export const adminAccess = (branchCount: number | string, role: Array<string>) => {
  if (branchCount === 0) {
    // Router.replace('/branches');
  } else {
    if (role.includes(roleKeys.doctor)) {
      Router.replace('/patients');
    } else {
      Router.replace('/patients');
    }
  }
};


export const capitalizeFirstLetter = (string: string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};


export const scrollToBottom = (node: HTMLElement | React.ReactNode): void => {
  if (node instanceof HTMLElement) {
    node.scrollTop = node.scrollHeight;
  }
};

export const convertHight = (value: number, unitToConvert: 'cm' | 'ft') => {
  let result: number | string = value;
  if (unitToConvert === 'cm') {
    // Convert cm to ft
    result = (value * 30.48).toFixed(2);
  } else if (unitToConvert === 'ft') {
    // Convert ft to cm
    result = (value / 30.48).toFixed(1);
  }
  return result;
};
export const convertWeight = (value: number, unitToConvert: 'kg' | 'lbs') => {
  let result: number | string = value;
  if (unitToConvert === 'lbs') {
    // Convert kg to lbs
    result = (value * 2.205).toFixed(2);
  } else if (unitToConvert === 'kg') {
    // Convert lbs to kg
    result = (value / 2.205).toFixed(2);
  }
  return result;
};

export function parseJwt(token:any) {
  if (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  return null;
}

export const arrhythmiaDuration = (arrhy: any) => {
  if (arrhy?.datalength) {
    if (arrhy?.version && arrhy?.version === 2) {
      return (arrhy?.datalength / 2) * 1000;
    } else if (arrhy?.version && arrhy?.version === 5) {
      return (arrhy?.datalength / 6) * 1000;
    } else {
      return new Date(arrhy.endtime).getTime() - new Date(arrhy.starttime).getTime();
    }
  } else {
    return new Date(arrhy.endtime).getTime() - new Date(arrhy.starttime).getTime();
  }
};

export const getDurationFromMiliSeconds = (val: number) => {
  // const time = val / 1000;
  let hours: string | number = Math.floor((val / (1000 * 60 * 60)) ^ 0);
  let minutes: string | number = Math.floor((val / (1000 * 60)) % 60);
  let seconds: string | number = Math.floor((val / 1000) % 60);
  const str = `${hours ? `${hours}h` : ''}${minutes ? ` ${minutes}m` : ''}${
    ((!hours && minutes) || !minutes) && seconds ? ` ${seconds}s` : ''
  }`;
  return str;
};


export const encodeBase64 = (encoded: any) => {
  return btoa(encoded);
};

export const decodeBase64 = (encoded: any) => {
  return atob(encoded);
};

export function formatStringWithPadding(str: string, maxLength: number) {
  // Ensure the string is no longer than the maxLength
  // let paddedString = `${str.slice(0, maxLength)}`;

  // // Add spaces to fill the rest of the maxLength
  // while (paddedString.length < maxLength) {
  //   paddedString += ' ' +;
  // }

  // // Add the colon at the end
  // return `${paddedString}:`;
  // Use padEnd to add spaces until maxLength, then add a colon at the end
  return str.padEnd(maxLength, ' ') + ':';
}

export const removeSpaces = (input: string): string => {
  return input.replace(/\s+/g, '');
};
