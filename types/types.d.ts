interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  password: string;
  is_admin: boolean;
  remember_token: string;
  created_at: string;
  updated_at: string;
}

interface Customer extends Omit<User, "is_admin"> {}

interface Address {
  id: number;
  user_id: number;
  name: string;
  full_address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_active: boolean;
}

interface Book {
  id: number;
  author_id: number;
  genre_id: number;
  title: string;
  published_date: string;
  price: number;
  stock_qty: number;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  cover_image?: string;
}

interface Genre {
  id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface Author {
  id: number;
  name: string;
  dob: string;
  nationality: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface OrderWithCustomer extends Order {
  customer: {
    id: number;
    name: string;
  };
}

interface DataResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

interface BookResponse {
  message: string;
  data: {
    current_page: number;
    data: Book[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string;
      label: string;
      active: boolean;
    }[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
  };
}
