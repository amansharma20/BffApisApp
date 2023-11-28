import axios from 'axios';
import { applicationProperties } from '../utils/application.properties';
import config from '@/config';

const get = async (endPoint, data) => {
  try {
    let response = await axios.get(config.baseUrl + endPoint, data, {
      headers: {},
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
    // console.log('ERROR');
  }
};

const post = async (endPoint, data, headers) => {
  try {
    let axs = axios.create({ withCredentials: true });
    let response = await axs.post(endPoint, data, {
      headers: headers,
      validateStatus: () => true,
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
    // console.log('ERROR');
  }
};

export const commonApi = {
  post,
  get,
};
