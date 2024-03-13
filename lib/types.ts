import { getTicketsWithAllRelations, getAuthUserDetails, getFunnels, getMedia, getPipelineDetails, getTicketsWithTags, getUserPermissions, getUsersWithAgencySubAccountPermissionsSidebarOptions, getNotificationAndUser } from "./queries";
import { Role, Notification, Prisma, User, Contact, Tag, Ticket, Lane, SubAccount } from "@prisma/client";
import Stripe from "stripe";
import * as z from 'zod'
export type NotificationWithUser =  Prisma.PromiseReturnType<
typeof getNotificationAndUser
>


export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;
export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>


export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof getUsersWithAgencySubAccountPermissionsSidebarOptions
  >

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>

export type TicketDetails = Prisma.PromiseReturnType<
  typeof getTicketsWithAllRelations
>
export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketsWithTags>
export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>
export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof getFunnels
>[0]
export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput
export type UpsertFunnelPage = Prisma.FunnelPageCreateWithoutFunnelInput

export type TicketAndTags = Ticket & {
  Tags: Tag[]
  Assigned: User | null
  Customer: Contact | null
}

export type LaneDetail = Lane & {
  Tickets: TicketAndTags[]
}

export type SubaccountWithContact = SubAccount & {
  Contact: (Contact & {
    Ticket: Ticket[]
  })[]
}

export type PricesList = Stripe.ApiList<Stripe.Price>

export type Address = {
  city: string
  country: string
  line1: string
  postal_code: string
  state: string
}

export type ShippingInfo = {
  address: Address
  name: string
}

export type StripeCustomerType = {
  email: string
  name: string
  shipping: ShippingInfo
  address: Address
}
