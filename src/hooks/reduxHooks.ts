import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/index';
import { ThunkDispatch } from 'redux-thunk';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => ThunkDispatch<any, any, any> = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
