// import React, { useReducer } from 'react';
// interface handleQuantityChange {
//     type: 'handleQuantityChange',
//     payload: {
//         id: number,
//         quantity: number
//     }
// }
// interface calculateTotal {
//     type: 'calculateTotal',
//     payload: {
//         products: CartItem[]
//     }
//  }
// interface handleRemoveItem {
//     type: 'handleRemoveItem',
//     payload: {
//         id: number
//     }
//  }
// interface validateQuantity {
//     type: 'validateQuantity',
//     payload: {
//         id: number,
//         quantity: number
//     }
// }
// interface AddToCart {
//     type: 'AddToCart',
//     payload: {
//         id: number
//     }
//  }
// interface handleCheckout {
//     type: 'handleCheckout',
//     payload: {
//         total: number
//     }
// }
// interface CartShoppingProps {
//     products: CartItem[]
//     total: number
//     error: string
//     dispatch: React.Dispatch<ShoppingAction>
//  }
// interface CartShoppingState  {
//         products: CartItem[],
//         total: 0,
//         error: ''
//     }
// interface CartItem {
//     id: number,
//     name: string,
//     price: number,
//     quantity: number

//  }

// //events
// // Product list
// // Quantity inputs
// // Total display
// // Error messages

// // Add error handling and validation
// // Implement checkout if time permitsProduct list
// // Quantity inputs
// // Total display
// // Error messages

// // Add error handling and validation
// // Implement checkout if time permits
// const initialState :CartShoppingState = {
//     products: [
//         { id: 1, name: 'Apple', price: 0.25, quantity: 1 },
//         { id: 2, name: 'Banana', price: 0.15, quantity: 1 },
//         { id: 3, name: 'Orange', price: 0.30, quantity: 1 }
//     ],
//     total: 0,
//     error: ''
// }
// type ShoppingAction =
//      |{ type : 'handleQuantityChange'; payload: { id: number, quantity: number }}
//     | {type : 'calculateTotal'; payload: { products: CartItem[] }}
//     | { type: 'handleRemoveItem'; payload: { id: number } }
//     | { type: 'validateQuantity'; payload: { id: number, quantity: number } }
//         | {
//             type: 'AddToCart'; payload: { id: number }
//                 | { type: 'handleCheckout'; payload: { total: number } }
// }

// function CartReducer(state: CartShoppingState, action: ShoppingAction): CartShoppingState  {
//     switch (action.type) {
//         case 'handleQuantityChange':
//             return {
//                 ...state,
//                 products: state.products.map(product => product.id === action.payload.id ? { ...product, quantity: action.payload.quantity } : product)
//             }
//         case 'calculateTotal':
//             return {
//                 ...state,
//                 total: action.payload.products.reduce((acc, product) => acc + product.price * product.quantity, 0)
//             }
//         case 'handleRemoveItem':
//             return {
//                 ...state,
//                 products: state.products.filter(product => product.id !== action.payload.id)
//             }
//         case 'validateQuantity':
//             return {
//                 ...state,
//                 error: action.payload.quantity <= 0 ? 'Quantity must be greater than 0' : ''
//             }
//         case 'AddToCart':
//             return {
//                 ...state,
//                 products: [...state.products, state.products.find(product => product.id === action.payload.id)]
//             }
//         case 'handleCheckout':
//             return {
//                 ...state,
//                 total: action.payload.total
//             }
//         default:
//             return state;
//     }
// }
// export const CartShopping: React.FC = () => {
//     const [state, dispatch] = useReducer(CartReducer, initialState);
//  }
import React, { useReducer } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Alert,
  Typography,
} from '@material-tailwind/react';
import { MinusCircle, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartShoppingState {
  products: CartItem[];
  total: number;
  error: string;
}

type ShoppingAction =
  | { type: 'handleQuantityChange'; payload: { id: number; quantity: number } }
  | { type: 'calculateTotal'; payload: { products: CartItem[] } }
  | { type: 'handleRemoveItem'; payload: { id: number } }
  | { type: 'validateQuantity'; payload: { id: number; quantity: number } }
  | { type: 'handleCheckout' }
  | { type: 'resetError' };

const initialState: CartShoppingState = {
  products: [
    { id: 1, name: 'Apple', price: 0.25, quantity: 1 },
    { id: 2, name: 'Banana', price: 0.15, quantity: 1 },
    { id: 3, name: 'Orange', price: 0.3, quantity: 1 },
  ],
  total: 0,
  error: '',
};

function cartReducer(
  state: CartShoppingState,
  action: ShoppingAction,
): CartShoppingState {
  switch (action.type) {
    case 'handleQuantityChange': {
      const updatedProducts = state.products.map((product) =>
        product.id === action.payload.id
          ? { ...product, quantity: action.payload.quantity }
          : product,
      );
      return {
        ...state,
        products: updatedProducts,
        total: updatedProducts.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0,
        ),
      };
    }
    case 'calculateTotal':
      return {
        ...state,
        total: action.payload.products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0,
        ),
      };
    case 'handleRemoveItem': {
      const updatedProducts = state.products.filter(
        (product) => product.id !== action.payload.id,
      );
      return {
        ...state,
        products: updatedProducts,
        total: updatedProducts.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0,
        ),
      };
    }
    case 'validateQuantity':
      return {
        ...state,
        error:
          action.payload.quantity <= 0 ? 'Quantity must be greater than 0' : '',
      };
    case 'handleCheckout':
      return {
        ...initialState,
        products: initialState.products.map((product) => ({
          ...product,
          quantity: 1,
        })),
      };
    case 'resetError':
      return {
        ...state,
        error: '',
      };
    default:
      return state;
  }
}

const CartShopping: React.FC = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = parseInt(value, 10);

    if (isNaN(quantity)) {
      dispatch({ type: 'validateQuantity', payload: { id, quantity: 0 } });
      return;
    }

    dispatch({ type: 'validateQuantity', payload: { id, quantity } });

    if (quantity > 0) {
      dispatch({ type: 'handleQuantityChange', payload: { id, quantity } });
      dispatch({ type: 'resetError' });
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'handleRemoveItem', payload: { id } });
  };

  const handleCheckout = () => {
    if (state.total > 0) {
      alert(`Checkout completed! Total: $${state.total.toFixed(2)}`);
      dispatch({ type: 'handleCheckout' });
    }
  };

  return (
    <Card
      className="w-full max-w-2xl mx-auto"
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <ShoppingCart className="w-6 h-6" />
          <Typography
            variant="h5"
            color="blue-gray"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Shopping Cart
          </Typography>
        </div>
      </CardHeader>

      <CardBody
        className="px-4 pt-0"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        {state.error && (
          <Alert color="red" className="mb-4">
            {state.error}
          </Alert>
        )}

        <div className="space-y-4">
          {state.products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <Typography
                  variant="h6"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  ${product.price.toFixed(2)} each
                </Typography>
              </div>

              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                  min="1"
                  className="w-20"
                  containerProps={{ className: 'min-w-[5rem]' }}
                  crossOrigin=""
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                />

                <Button
                  variant="text"
                  color="red"
                  onClick={() => handleRemoveItem(product.id)}
                  className="p-2"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <MinusCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>

      <CardFooter
        className="pt-0"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <div className="flex justify-between items-center p-4 bg-blue-gray-50 rounded-lg mb-4">
          <Typography
            variant="h6"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Total:
          </Typography>
          <Typography
            variant="h6"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            ${state.total.toFixed(2)}
          </Typography>
        </div>

        <Button
          size="lg"
          fullWidth
          onClick={handleCheckout}
          disabled={state.total === 0}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartShopping;
