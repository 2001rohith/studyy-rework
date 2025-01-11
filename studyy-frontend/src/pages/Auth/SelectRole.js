import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserService } from '../../utils/userService'
import { useUser } from "../../UserContext"


const SelectRole = () => {
  const { roleSelection } = useUserService()
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('');
  const { user, login } = useUser()
  const [email, setEmail] = useState(location.state?.email || '');
  const [token, setToken] = useState(location.state?.token || '');
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState('');
  const [tokenFromUrl, setTokenFromUrl] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenInUrl = queryParams.get('token');
    if (tokenInUrl) {
      setTokenFromUrl(tokenInUrl);
      setToken(tokenInUrl);
    }
  }, [location.search]);

  const handleRoleSelection = async () => {
    try {
      if (selectedRole === 'teacher' && !certificate) {
        setMessage('Upload a certificate as PDF!');
        return;
      }

      if (!selectedRole || !token) {
        setMessage('Role or token is missing.');
        return;
      }

      const data = await roleSelection(token,selectedRole, certificate);

      login(data.user, data.token);
      const userData = { email, role: data.role };

      const roleRoutes = {
        teacher: '/teacher-home',
        student: '/student-home',
      };

      const route = roleRoutes[data.role] || '/';
      navigate(route, { state: { user: userData } });

      setMessage('Role selected successfully!');
    } catch (error) {
      console.error('Error during role selection:', error);
      setMessage(error.message || 'Error during role selection, please try again.');
    }
  };


  return (
    <div className="wrapper">
      <div className="container login-boxx">
        <div className="login-items">
          <div className="select-role">
            <h4 className="select-role-heading">Who are you?</h4>
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedRole ? selectedRole : 'Select Role'}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedRole('student')}
                  >
                    Student
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedRole('teacher')}
                  >
                    Teacher
                  </a>
                </li>
              </ul>
            </div>
            {selectedRole === 'teacher' && (
              <div className="mt-3 form">
                <label htmlFor="certificate">Upload Teacher Certificate:</label>
                <input
                  type="file"
                  id="certificate"
                  onChange={(e) => setCertificate(e.target.files[0])}
                  className="form-control"
                />
              </div>
            )}
            <button className="btn btn-primary mt-3 rolesectbutton" onClick={handleRoleSelection}>
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
