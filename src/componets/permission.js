
// src/hooks/usePermissions.js
import { useEffect, useState } from 'react';
import { decryptData } from './cryptoUtils';
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';


const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const encryptedPermissions = localStorage.getItem('Permission');

    if (encryptedPermissions) {

      try {
        const storedPermissions = decryptData(encryptedPermissions);
        //console.log('ayush',storedPermissions);
        
        // Filter permissions to get only those with a value of true
        const filteredPermissions = storedPermissions.filter(permission => {
          const key = Object.keys(permission)[0];
          return permission[key] === true;
        });
        // console.log('permission', filteredPermissions);

        setPermissions(filteredPermissions);
      } catch (error) {
        console.error('Failed to decrypt permissions', error);
      }
    }
  }, []);

  return permissions;
};
export default usePermissions;

export const hasPermission = (permissions, permissionKey) => {
  //console.log(permissions.some(permission => permission[permissionKey] === true));

  return permissions.some(permission => permission[permissionKey] === true);
};

export const ProtectedRoute = ({ component: Component, requiredPermission, ...rest }) => {
  const permissions = usePermissions();

  return (
    <Route
      {...rest}
      render={props => {
        ////console.log('Current Permissions:', permissions); // Debug
        ////console.log('Required Permission:', requiredPermission); // Debug

        if (hasPermission(permissions, requiredPermission)) {
          return <Component {...props} />;
        } else {
          toast.error("You do not have permission to access this page.");
          return <Redirect to="/errorpage" />;
        }
      }}
    />
  );
};

// export const ProtectedRoute = ({ component: Component, requiredPermission, ...rest }) => {
//   const permissions = usePermissions();

//   return (
//     <Route
//       {...rest}
//       render={props => {
//         //console.log('Current Permissions:', permissions); // Debug: Check current permissions
//         //console.log('Required Permission:', requiredPermission); // Debug: Check the required permission

//         if (hasPermission(permissions, requiredPermission)) {
//           return <Component {...props} />;
//         } else {
//           toast.error("You do not have permission to access this page.");
//           return <Redirect to="/errorpage" />;
//         }
//       }}
//     />
//   );
// };