ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "loyalty_cards" ADD COLUMN "code" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
CREATE UNIQUE INDEX "code_tenant_idx" ON "loyalty_cards" USING btree ("code","tenant_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number");