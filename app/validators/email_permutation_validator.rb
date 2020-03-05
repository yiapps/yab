# frozen_string_literal: true

class EmailPermutationValidator < ActiveModel::Validator
  def validate(user)
    return if skip_validate? user

    @email = user.email
    @blocked_emails = ENV['BLOCKED_EMAILS'].split(',')
    user.errors.add(:email, I18n.t('users.invalid_email')) if blocked_email?
  end

  private

  def skip_validate?(user)
    user.email.blank? or ENV['BLOCKED_EMAILS'].blank?
  end

  def blocked_email?
    @blocked_emails.include? stripped_dots_email
  end

  def stripped_dots_email
    username, domain = @email.split('@')
    "#{username.gsub('.', '')}@#{domain}"
  end
end
