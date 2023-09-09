import { ActionArgs, json, type LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Button from "~/components/button";
import { Divider } from "~/components/divider";
import TextInput from "~/components/text-input";
import { UsernameType } from "~/types/user";
import { requireUser } from "~/utils/sessions.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json(user);
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Settings</h1>
      <div className="my-2">
        <Divider />
      </div>
      <div className="grid gap-16 sm:grid-cols-2">
        <Form className="flex flex-col gap-2" method="post" action="/api/user/update?redirect">
          <h2>User settings</h2>
          <p>Username</p>
          <TextInput name="username" placeholder={data.username} />
          <Button type="submit">Save</Button>
        </Form>
        <div className="block sm:hidden">
          <Divider />
        </div>
        <Form className="flex flex-col gap-2" action="/api/user/password?redirect">
          <h2>Password</h2>
          <p>Old password</p>
          <TextInput type="password" name="oldPassword" placeholder="Old password" />
          <p>New password</p>
          <TextInput type="password" name="newPassword" placeholder="New password" />
          <p>Confirm new password</p>
          <TextInput type="password" name="confirmNewPassword" placeholder="New password" />
          <Button>Save</Button>
        </Form>
        <div className="block sm:hidden">
          <Divider />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Delete account</h2>
          <p>Delete account and all of your clips. THIS IS UNREVERSIBLE.</p>
          <Button type="submit" destructive>
            Delete account
          </Button>
        </div>
      </div>
    </>
  );
}