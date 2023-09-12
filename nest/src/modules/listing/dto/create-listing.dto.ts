export interface CreateListingDTO {
  category: string;
  location: {
    flag: string;
    label: string;
    latlng: [number, number];
    region: string;
    value: string;
  };
  maxGuests: number;
  minGuests: number;
  imageSrc: string;
  description: string;
  eventDate: string;
  eventTime: {
    hour: number;
    minute: number;
  };
  title: string;
  price: string;
}
