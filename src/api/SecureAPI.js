import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { applicationProperties } from '../utils/application.properties';
import config from '@/config';

const get = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }

  try {
    let response = await axios.get(config.baseUrl + endPoint, {
      headers: {
        token: token,
      },
      validateStatus: () => true,
      withCredentials: true,
    });
    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: true,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const getWithEndpoint = async (endPoint, data, loading) => {
  console.log('endPoint: ', endPoint);
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }

  try {
    let response = await axios.get(endPoint, {
      headers: {
        token: token,
      },
      validateStatus: () => true,
      withCredentials: true,
    });

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: true,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const post = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.post(config.baseUrl + endPoint, data, {
      headers: {
        token: token,
      },
      validateStatus: () => true,
      withCredentials: true,
    });

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const postWithEndpoint = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.post(endPoint, data, {
      headers: {
        token: token,
      },
      validateStatus: () => true,
      withCredentials: true,
    });

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const Delete = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.delete(
      applicationProperties.baseUrl + endPoint,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: token,
        },
        data: data,
        validateStatus: () => true,
        withCredentials: true,
      },
    );

    console.log('response: ', response);

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const put = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.put(
      applicationProperties.baseUrl + endPoint,
      data,
      {
        headers: {
          token: token,
        },
        validateStatus: () => true,
        withCredentials: true,
      },
    );

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const putWithEndPoint = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.put(endPoint, data, {
      headers: {
        token: token,
      },
      validateStatus: () => true,
      withCredentials: true,
    });

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const patch = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.patch(
      applicationProperties.baseUrl + endPoint,
      data,
      {
        headers: {
          token: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: () => true,
        withCredentials: true,
      },
    );

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

export const api = {
  get,
  getWithEndpoint,
  post,
  postWithEndpoint,
  put,
  Delete,
  patch,
  putWithEndPoint,
};
