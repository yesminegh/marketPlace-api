import get from 'crud/get';
import list from 'crud/list';
import OrderDetail from 'models/orderDetail.model';
import { Role } from 'models/user.model';
import { OrderDetailType } from 'types/orderDetail.type';

export default {
  orderDetails: list(OrderDetail, OrderDetailType, { authorizationRoles: [Role.ADMIN, Role.OWNER] }),
  orderDetail: get(OrderDetail, OrderDetailType, { authorizationRoles: [Role.ADMIN, Role.OWNER] }),
};
