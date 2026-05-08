export interface Office {
  city: string;
  address: string;
  poBox: string;
  mobile: string;
  tel: string;
  fax: string;
  email: string;
}

export const offices: Office[] = [
  {
    city: "Abu Dhabi",
    address: "Office No. M04, Ahmed Abdulla Alhameli Bldg, Salam Street, Abu Dhabi, UAE",
    poBox: "P.O Box: 128841",
    mobile: "+971 50 321 7569",
    tel: "+971 2 643 2711",
    fax: "+971 4 392 7788",
    email: "info@winteriorsdecor.com"
  },
  {
    city: "Dubai",
    address: "Office No. 1706, Concord Tower, Dubai Media City, Dubai, UAE",
    poBox: "P.O Box: 643859",
    mobile: "+971 50 515 9927",
    tel: "+971 4 399 0226",
    fax: "+971 4 392 7788",
    email: "info@winteriorsdecor.com"
  },
];

export const primaryPhone = "+971 50 321 7569";
export const primaryEmail = "info@winteriorsdecor.com";
